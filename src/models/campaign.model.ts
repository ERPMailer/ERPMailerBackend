import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';
import { Campaign } from '@/interfaces/campaign.interface';

const campaignSchema: Schema = new Schema({
  campaignName: {
    type: String,
    required: true,
    unique: true,
  },
  templateId: {
    type:String,
    required: false,
    unique: true,
  },
  isSheduled: {
    type:Boolean,
    required: false,
  },
  time: {
    type:String,
    required: false,
  },
});

const campaignModule = model<Campaign & Document>('Campaign', campaignSchema);

export default campaignModule;
