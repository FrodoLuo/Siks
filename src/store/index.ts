import AuthStatus from './auth';
import PublishController from './publish';
import QuestStore from './quest';

export default {
  authStatus: new AuthStatus(),
  publishController: new PublishController(),
  questStore: new QuestStore(),
};
