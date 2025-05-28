import { CampaignDto } from "@/dtos/campaign.dto";
import { Campaign } from "@/interfaces/campaign.interface";
import campaignModule from "@/models/campaign.model";


export default class CampaignService{
  public campaign =campaignModule;

    public async createCampaign(campaignData: CampaignDto): Promise<Campaign> {

    const createUserData: Campaign = await this.campaign.create(campaignData);

        return createUserData;
    }

    // Get campaign by ID
  public async getCampaignById(userId: string): Promise<Array<Campaign> | []> {
    const campaign: Array<Campaign>  = await this.campaign.find({userId:userId});
    return campaign;
  }

  // Get all campaigns
  public async getAllCampaigns(): Promise<Campaign[]> {
    const campaigns: Campaign[] = await this.campaign.find();
    return campaigns;
  }

  // Update campaign by ID
  public async updateCampaign(id: string, data: Partial<CampaignDto>): Promise<Campaign | null> {
    const existing = await this.campaign.findByIdAndUpdate(id,data);
    return existing;
  }
 
}