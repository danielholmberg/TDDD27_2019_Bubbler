import { success, failure } from "./libs/response-lib";
import SystembolagetData from "./resources/systembolaget.json";

export async function main(event, context) {
  try {
    const data = await SystembolagetData.items.filter(item => item.group === "Mousserande vin");
    if (data) {
      return success(data);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    return failure({ status: false });
  }
}
