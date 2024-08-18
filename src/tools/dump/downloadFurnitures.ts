import path from "path";
import { string } from "yargs";
import { FurnitureData } from "../../objects/furniture/FurnitureData";
import {
  downloadFile,
  DownloadFileResult,
  DownloadRequest,
} from "./downloadFile";
import { downloadMultipleFiles } from "./downloadMultipleFiles";
import { Logger } from "./Logger";
import { parseExternalVariables } from "./parseExternalVariables";

export async function downloadFurnitures(
  {
    downloadPath,
    hofFurniUrl,
    file,
    externalTexts,
  }: {
    downloadPath: string;
    hofFurniUrl: string;
    file: DownloadFileResult;
    externalTexts: DownloadFileResult;
  },
  logger: Logger
) {
  if (file.type !== "SUCCESS") {
    logger.info(
      "Skipping downloading furniture, since we couldn't download the furniture data."
    );
    return;
  }

  const furniData = new FurnitureData(() => file.text());
  const infos = await furniData.getInfos();

  const furnitureRequests = new Map<string, number>();
  for (const [key, info] of infos) {
    if (info.revision) {
      furnitureRequests.set(key.split("*")[0], info.revision)
    }
  }

  // Extract poster variants from the external texts.
  if (externalTexts.type === "SUCCESS") {
    const posterRevision = furnitureRequests.get("poster");
    if (posterRevision) {
      const texts = parseExternalVariables(await externalTexts.text())
      const regexPosterVariant = /^poster_(\d+)_name$/i
      for (const [key] of texts) {
        const match = regexPosterVariant.exec(key);
        if (match) {
          furnitureRequests.set(`poster${match[1]}`, posterRevision);
        }
      }
    }
  } else {
    logger.info(
      "Skipping downloading poster variants, since we couldn't download the external texts."
    );
  }

  await downloadMultipleFiles(
    {
      data: [...furnitureRequests.entries()].map(([type, revision]) => ({ type, revision })),
      concurrency: 30,
      logger,
      name: "Furnitures",
    },
    async (element, view) => {
      const swfPath =
        element.revision != null
          ? `${element.revision}/${element.type}.swf`
          : `${element.type}.swf`;

      const request: DownloadRequest = {
        url: `${hofFurniUrl}${swfPath}`,
        savePath: path.join(downloadPath, "hof_furni", swfPath),
      };

      const id = `Revision: ${element.revision ?? "-"}, Type: ${element.type}`;
      const result = await downloadFile(request);
      switch (result.type) {
        case "SUCCESS":
          if (element.revision != null) {
            view.reportSuccess(id);
          } else {
            view.reportSuccess(id);
          }
          break;

        case "FAILED_TO_WRITE":
        case "HTTP_ERROR":
          view.reportError(id, request, result);
          break;
      }
    }
  );
}
