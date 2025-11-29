import e from "express";
import { PdfController } from "../../controller/pdf.controller.js";
const pdfRoutes = e.Router();

pdfRoutes.post("/getPdf", PdfController.getAllUserPdf);

export default pdfRoutes;
