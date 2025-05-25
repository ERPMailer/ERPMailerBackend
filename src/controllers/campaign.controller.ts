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

    public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const campaign = await this.campaignService.getCampaignById(id);
      if (!campaign) {
        return res.status(404).send({ message: 'Campaign not found' });
      }
      return res.status(200).send(campaign);
    } catch (error) {
      next(error);
    }
  };

  // Get all campaigns
  public findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaigns = await this.campaignService.getAllCampaigns();
      return res.status(200).send(campaigns);
    } catch (error) {
      next(error);
    }
  };

  // Update campaign by ID
  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await this.campaignService.updateCampaign(id, data);
      if (!updated) {
        return res.status(404).send({ message: 'Campaign not found or not updated' });
      }
      return res.status(200).send(updated);
    } catch (error) {
      next(error);
    }
  };
}