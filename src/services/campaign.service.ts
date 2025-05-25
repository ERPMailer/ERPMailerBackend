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
  public async getCampaignById(id: string): Promise<Campaign | null> {
    const campaign: Campaign | null = await this.campaign.findById(id);
    return campaign;
  }

  // Get all campaigns
  public async getAllCampaigns(): Promise<Campaign[]> {
    const campaigns: Campaign[] = await this.campaign.findAll();
    return campaigns;
  }

  // Update campaign by ID
  public async updateCampaign(id: string, data: Partial<CampaignDto>): Promise<Campaign | null> {
    const existing = await this.campaign.findById(id);
    if (!existing) return null;

    await this.campaign.updateOne({ _id: id }, data); // or existing.update(data) depending on ORM
    const updated = await this.campaign.findById(id);
    return updated;
  }
 
}