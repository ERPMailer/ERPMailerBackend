import { CreateTemplateRequest, ValidationError } from "@/interfaces/template.interface";

export class TemplateValidator {
  static validateCreateTemplate(data: CreateTemplateRequest): ValidationError[] {
    const errors: ValidationError[] = [];

    // Template name validation
    if (!data.name || typeof data.name !== 'string') {
      errors.push({ field: 'name', message: 'Template name is required' });
    } else if (data.name.length < 3) {
      errors.push({ field: 'name', message: 'Template name must be at least 3 characters' });
    } else if (data.name.length > 100) {
      errors.push({ field: 'name', message: 'Template name cannot exceed 100 characters' });
    }

    // Subject validation
    if (!data.subject || typeof data.subject !== 'string') {
      errors.push({ field: 'subject', message: 'Email subject is required' });
    } else if (data.subject.length < 5) {
      errors.push({ field: 'subject', message: 'Subject must be at least 5 characters' });
    } else if (data.subject.length > 200) {
      errors.push({ field: 'subject', message: 'Subject cannot exceed 200 characters' });
    }

    // Message validation
    if (!data.message || typeof data.message !== 'string') {
      errors.push({ field: 'message', message: 'Message body is required' });
    } else if (data.message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Message body must be at least 10 characters' });
    }

    // Footer validation (optional)
    if (data.footer && data.footer.length > 500) {
      errors.push({ field: 'footer', message: 'Footer cannot exceed 500 characters' });
    }

    // Buttons validation
    if (data.buttons && Array.isArray(data.buttons)) {
      data.buttons.forEach((button, index) => {
        if (!button.label || button.label.trim().length === 0) {
          errors.push({ 
            field: `buttons[${index}].label`, 
            message: 'Button label is required' 
          });
        }
        if (!button.url || !this.isValidUrl(button.url)) {
          errors.push({ 
            field: `buttons[${index}].url`, 
            message: 'Valid button URL is required' 
          });
        }
        if (!['primary', 'secondary', 'success'].includes(button.style)) {
          errors.push({ 
            field: `buttons[${index}].style`, 
            message: 'Invalid button style' 
          });
        }
      });
    }

    // Variables validation
    if (data.variables && Array.isArray(data.variables)) {
      const variableNames = new Set();
      data.variables.forEach((variable, index) => {
        if (!variable.name || variable.name.trim().length === 0) {
          errors.push({ 
            field: `variables[${index}].name`, 
            message: 'Variable name is required' 
          });
        } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable.name)) {
          errors.push({ 
            field: `variables[${index}].name`, 
            message: 'Variable name must contain only letters, numbers, and underscores' 
          });
        } else if (variableNames.has(variable.name)) {
          errors.push({ 
            field: `variables[${index}].name`, 
            message: 'Duplicate variable name' 
          });
        }
        variableNames.add(variable.name);
      });
    }

    // Attachments validation
    if (data.attachments && Array.isArray(data.attachments)) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      data.attachments.forEach((attachment, index) => {
        if (!attachment.name || attachment.name.trim().length === 0) {
          errors.push({ 
            field: `attachments[${index}].name`, 
            message: 'Attachment name is required' 
          });
        }
        if (attachment.size > maxFileSize) {
          errors.push({ 
            field: `attachments[${index}].size`, 
            message: 'Attachment size cannot exceed 10MB' 
          });
        }
        if (!allowedTypes.includes(attachment.type)) {
          errors.push({ 
            field: `attachments[${index}].type`, 
            message: 'Unsupported file type' 
          });
        }
      });
    }

    // Image validation (base64)
    if (data.image && !this.isValidBase64Image(data.image)) {
      errors.push({ field: 'image', message: 'Invalid image format' });
    }

    // Signature validation (base64)
    if (data.signature && !this.isValidBase64Image(data.signature)) {
      errors.push({ field: 'signature', message: 'Invalid signature format' });
    }

    return errors;
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidBase64Image(base64: string): boolean {
    const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
    return base64Regex.test(base64);
  }
}