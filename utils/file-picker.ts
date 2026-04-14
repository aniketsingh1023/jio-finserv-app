import * as DocumentPicker from 'expo-document-picker';

export interface PickedFile {
  name: string;
  size: number;
  mimeType: string;
  uri: string;
}

/**
 * Pick a PDF file from the device
 * @returns The picked file with name, size, mimeType, and URI, or null if cancelled
 */
export const pickPDFFile = async (): Promise<PickedFile | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });

    if (result.canceled) {
      return null;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        name: asset.name,
        size: asset.size || 0,
        mimeType: asset.mimeType || 'application/pdf',
        uri: asset.uri,
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking PDF file:', error);
    throw error;
  }
};

/**
 * Convert a file URI to a Blob for FormData submission
 * @param fileUri - The file URI from Document Picker
 * @param fileName - The original file name
 * @param mimeType - The MIME type of the file
 * @returns A Blob object
 */
export const uriToBlob = async (
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<Blob> => {
  try {
    const response = await fetch(fileUri);
    return await response.blob();
  } catch (error) {
    console.error('Error converting URI to Blob:', error);
    throw error;
  }
};
