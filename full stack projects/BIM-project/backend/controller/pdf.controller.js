import { supabase } from "../model/supabase.js";
import { validateRequiredFields } from "../utils/GlobalFieldValidator.js";
import { sendResponse } from "../utils/GlobalResponseSender.js";

export class PdfController {

  static getAllUserPdf = async (req, res) => {
    try {
      const { userId } = req.body;
      const validationError = validateRequiredFields(["userId"], req, res);
      if (validationError) return validationError;
      const response = await supabase.from("pdfs").select("*").eq("user_id", userId);

      return sendResponse(res, 200, "pdf found successfully", response.data);
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, `error ${err}`, []);
    }
  };

 
}
