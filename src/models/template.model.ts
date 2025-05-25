import { IMessageTemplate } from '@/interfaces/template.interface';
import mongoose, { Schema, Document, model } from 'mongoose';

const MessageTemplateSchema: Schema = new Schema<IMessageTemplate>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    footer: { type: String, required: false },
    image: { type: String },
    signature: { type: String },
    buttons: { type: [], default: [] },
    variables: { type: [], default: [] },
    attachments: { type: [], default: [] },
    userId: { type: String, required: true, ref: 'User' },
    createdBy: { type: String, required: true, ref: 'User' },
    actionTakenBy: { type: String, ref: 'User' },
    approved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const TemplateModel = model<IMessageTemplate & Document>('MessageTemplate', MessageTemplateSchema);

export default TemplateModel;
