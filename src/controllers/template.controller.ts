import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';
import { CreateTemplateRequest, CreateTemplateResponse } from '@/interfaces/template.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { TemplateValidator } from '@/utils/templateValidator';
import { Types } from 'mongoose';

export class TemplateController {
  private templateService = new TemplateService();

  public createTemplate = async (req: RequestWithUser, response: Response) => {
    try {
      const data: CreateTemplateRequest = JSON.parse(req.body.template);
     // const userId = new Types.ObjectId().toString();
const userId = '68373f988a25f210d16d9d57';
      //   const validationErrors = TemplateValidator.validateCreateTemplate(data);
      //   if (validationErrors.length > 0) {
      //     const res: CreateTemplateResponse = {
      //       success: false,
      //       message: 'Validation failed',
      //       errors: validationErrors
      //     };
      //     response.status(400).json(res);
      //     return;
      //   }

      const template = await this.templateService.createTemplate(data, userId);

      const res: CreateTemplateResponse = {
        success: true,
        data: template,
        message: 'Template created successfully',
      };

      response.status(201).json(res);
    } catch (error) {
      console.error('Create template error:', error);

      const res: CreateTemplateResponse = {
        success: false,
        message: 'Internal server error',
      };

      response.status(500).json(res);
    }
  };

  async getTemplate(req: Request, response: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = await this.templateService.getTemplate(id);

      if (!template) {
        response.status(404).json({
          success: false,
          message: 'Template not found',
        });
        return;
      }

      response.json({
        success: true,
        data: template,
      });
    } catch (error) {
      console.error('Get template error:', error);
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  public getUserTemplates= async (req: RequestWithUser, response: Response)=> {
    try {
      // const userId = req.user?._id;
      const userId = '68373f988a25f210d16d9d57';
      if (!userId) {
        response.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const templates = await this.templateService.getUserTemplates(userId);

      response.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      console.error('Get user templates error:', error);
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateTemplate(req: Request, response: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      // Validate request data if provided
      if (Object.keys(data).length > 0) {
        const validationErrors = TemplateValidator.validateCreateTemplate(data as CreateTemplateRequest);
        if (validationErrors.length > 0) {
          response.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors,
          });
          return;
        }
      }

      const template = await this.templateService.updateTemplate(id, data);

      if (!template) {
        response.status(404).json({
          success: false,
          message: 'Template not found',
        });
        return;
      }

      response.json({
        success: true,
        data: template,
        message: 'Template updated successfully',
      });
    } catch (error) {
      console.error('Update template error:', error);
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async deleteTemplate(req: Request, response: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.templateService.deleteTemplate(id);

      if (!deleted) {
        response.status(404).json({
          success: false,
          message: 'Template not found',
        });
        return;
      }

      response.json({
        success: true,
        message: 'Template deleted successfully',
      });
    } catch (error) {
      console.error('Delete template error:', error);
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getTemplatePreview(req: Request, response: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = await this.templateService.getTemplate(id);

      if (!template) {
        response.status(404).json({
          success: false,
          message: 'Template not found',
        });
        return;
      }

      const html = this.templateService.generatePreviewHTML(template);
      response.setHeader('Content-Type', 'text/html');
      response.send(html);
    } catch (error) {
      console.error('Get template preview error:', error);
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
