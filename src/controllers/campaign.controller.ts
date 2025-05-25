import CampaignService from "@/services/campaign.service";
import { NextFunction, Request, Response } from "express";


export default class CampaignController{
 
  public campaignService = new CampaignService();

    public create =async (req: Request, res: Response, next: NextFunction) => {
        try{
        const  data = req.body
        const response = await this.campaignService.createCampaign(data);
        return res.status(200).send(response);
        }catch (error) {
      next(error);
    }
    }
}