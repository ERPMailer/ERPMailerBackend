import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import TemplateRoute from './routes/template.route';
import CampaignRoutes from './routes/campaign.routes';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute() , new TemplateRoute(), new CampaignRoutes()]);

app.listen();
