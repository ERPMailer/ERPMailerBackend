import { Attachment, CreateTemplateRequest, EmailTemplate } from '@/interfaces/template.interface';
import TemplateModel from '@/models/template.model';
import { FileUtils } from '@/utils/util';
import { v4 as uuidv4 } from 'uuid';

export class TemplateService {
  private templateModel = TemplateModel;

  async createTemplate(data: CreateTemplateRequest, userId?: string): Promise<EmailTemplate> {
    try {
      let imageFileName: string | undefined;
      if (data.image) {
        imageFileName = await FileUtils.saveBase64File(data.image, 'template-image');
      }

      let signatureFileName: string | undefined;
      if (data.signature) {
        signatureFileName = await FileUtils.saveBase64File(data.signature, 'template-signature');
      }

      const processedAttachments: Attachment[] = [];
      if (data.attachments && data.attachments.length > 0) {
        for (const attachment of data.attachments) {
          if (attachment.data) {
            const fileName = await FileUtils.saveBase64File(attachment.data, attachment.name);
            processedAttachments.push({
              ...attachment,
              fileName,
              data: undefined, // Remove base64 data to save space
            });
          } else {
            processedAttachments.push(attachment);
          }
        }
      }

      // Create template object
      const template: EmailTemplate = {
        name: data.name,
        subject: data.subject,
        message: data.message,
        footer: data.footer,
        image: imageFileName,
        signature: signatureFileName,
        buttons: data.buttons || [],
        variables: data.variables || [],
        attachments: processedAttachments,
        userId,
        createdBy:userId
      };

      const savedTemplate = await this.templateModel.create(template);
      return savedTemplate;
    } catch (error) {
      console.error('Template creation failed:', error);
      throw error;
    }
  }

  async getTemplate(id: string): Promise<EmailTemplate | null> {
    return await this.templateModel.findById(id);
  }

  async getUserTemplates(userId: string): Promise<EmailTemplate[]> {
    return await this.templateModel.find({ createdBy: userId });
  }

  async updateTemplate(id: string, data: Partial<CreateTemplateRequest>): Promise<EmailTemplate | null> {
    const existingTemplate = await this.templateModel.findById(id);
    if (!existingTemplate) {
      throw new Error('Template not found');
    }

    const updates: Partial<EmailTemplate> = { ...data };

    if (data.image && data.image !== existingTemplate.image) {
      if (existingTemplate.image) {
        await FileUtils.deleteFile(existingTemplate.image);
      }
      updates.image = await FileUtils.saveBase64File(data.image, 'template-image');
    }

    if (data.signature && data.signature !== existingTemplate.signature) {
      if (existingTemplate.signature) {
        await FileUtils.deleteFile(existingTemplate.signature);
      }
      updates.signature = await FileUtils.saveBase64File(data.signature, 'template-signature');
    }

    return await this.templateModel.findByIdAndUpdate(id, updates);
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const template = await this.templateModel.findById(id);
    if (!template) {
      return false;
    }

    // Clean up associated files
    if (template.image) {
      await FileUtils.deleteFile(template.image);
    }
    if (template.signature) {
      await FileUtils.deleteFile(template.signature);
    }

    for (const attachment of template.attachments) {
      if (attachment.fileName) {
        await FileUtils.deleteFile(attachment.fileName);
      }
    }

    return await this.templateModel.findByIdAndDelete(id);
  }

  // Generate preview HTML
  generatePreviewHTML(template: EmailTemplate): string {
    const buttonHTML = template.buttons
      .map(
        button => `
        <a href="${button.url}" style="
          display: inline-block;
          padding: 12px 24px;
          margin: 8px 4px;
          background-color: ${button.style === 'primary' ? '#1976d2' : button.style === 'secondary' ? '#757575' : '#4caf50'};
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          font-family: Arial, sans-serif;
        ">${button.label}</a>
      `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px;">
          <h1 style="color: #1976d2; text-align: center;">${template.name}</h1>
          <h2 style="color: #666;">${template.subject}</h2>
          ${
            template.image
              ? `<div style="text-align: center; margin: 20px 0;"><img src="/uploads/${template.image}" style="max-width: 100%; height: auto;"></div>`
              : ''
          }
          <div style="margin: 20px 0;">${template.message}</div>
          ${buttonHTML ? `<div style="text-align: center; margin: 30px 0;">${buttonHTML}</div>` : ''}
          ${template.footer ? `<div style="margin-top: 30px; text-align: center; font-size: 14px; color: #666;">${template.footer}</div>` : ''}
          ${
            template.signature
              ? `<div style="margin-top: 30px;"><img src="/uploads/${template.signature}" style="max-width: 300px; height: auto;"></div>`
              : ''
          }
        </div>
      </body>
      </html>
    `;
  }
}
