import { Storage } from "aws-amplify";

/**
 * This convenience method takes a file object as a parameter. Generates a unique 
 * file name using the current timestamp (Date.now()). Of course, if our app is 
 * being used heavily this might not be the best way to create a unique filename. 
 * But this should be fine for now. 
 * It then uploads the file to the user’s folder in S3 using the Storage.vault.put() object. 
 * Alternatively, if we were uploading publicly we can use the Storage.put() method.
 * Finally, it returns the stored object's key.
 */
export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });

  return stored.key;
}
