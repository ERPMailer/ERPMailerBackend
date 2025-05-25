import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import { Routes } from '@/interfaces/routes.interface';

export default class TemplateRoute implements Routes {
  public path = '/template';
  public router = Router();
  public templateController = new TemplateController();

  constructor() {
    this.initializeRoutes();
  }

private initializeRoutes() {

this.router.post(`${this.path}/create`,  this.templateController.createTemplate);
this.router.get(`${this.path}/get-template-user-id`, authMiddleware, this.templateController.getUserTemplates);
this.router.get('/:id', authMiddleware, this.templateController.getTemplate);
this.router.put('/:id', authMiddleware, this.templateController.updateTemplate);
this.router.delete('/:id', authMiddleware, this.templateController.deleteTemplate);
this.router.get('/:id/preview', this.templateController.getTemplatePreview);
}
}
