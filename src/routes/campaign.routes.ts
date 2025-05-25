import AuthController from "@/controllers/auth.controller";
import CampaignController from "@/controllers/campaign.controller";
import { Routes } from "@/interfaces/routes.interface";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Router } from "express";

export default class CampaignRoutes implements Routes {
public path = '/';
  public router = Router();
  public campignController = new CampaignController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}createCampaign`,  this.campignController.create);
  
  }
}