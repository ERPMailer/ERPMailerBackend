import { CampaignDto } from "@/dtos/campaign.dto";
import { Campaign } from "@/interfaces/campaign.interface";
import campaignModule from "@/models/campaign.model";


export default class CampaignService{
  public campaign =campaignModule;

    public async createCampaign(campaignData: CampaignDto): Promise<Campaign> {

    const createUserData: Campaign = await this.campaign.create(campaignData);

        return createUserData;
    }
 
}