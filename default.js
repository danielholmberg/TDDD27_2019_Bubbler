import { success, failure } from "./libs/response-lib";

/**
 * Does nothing but log that the handler was called.
 */
export async function main(event, context) {

  try {
    
    console.log('Default handler was called.');
    console.log('Event', event);

    return success('DefaultHandler');
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}