export interface Variable {
  id: string;
  name: string;
  description: string;
  example: string;
}

export interface CTAButton {
  id: string;
  label: string;
  url: string;
  style: 'primary' | 'secondary' | 'success';
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  data?: string; // Base64 encoded data
  fileName?: string; // Saved file name
}

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  message: string;
  footer?: string;
  image?: string; // Base64 or file path
  signature?: string; // Base64 or file path
  buttons: CTAButton[];
  variables: Variable[];
  attachments: Attachment[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  createdBy?: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  message: string;
  footer?: string;
  image?: string;
  signature?: string;
  buttons: CTAButton[];
  variables: Variable[];
  attachments: Attachment[];
}

export interface CreateTemplateResponse {
  success: boolean;
  data?: EmailTemplate;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface IMessageTemplate {
  name: string;
  subject: string;
  message: string;
  footer: string;
  image?: string;
  signature?: string;
  buttons: any[]; // You can define a specific type if needed
  variables: any[];
  attachments: any[];
  userId: string;
  createdBy: string;
  actionTakenBy?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}