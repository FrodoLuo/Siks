import AuthStatus from './auth';
import PublishController from './publish';
import QuestStore from './quest';
import QuestDetailStore from './questDetailStore';
import personalStore, {PersonlStore} from './personlStore'
import SchoolConfig from './school';

export default {
  authStatus: AuthStatus,
  publishController: PublishController,
  questDetailStore: QuestDetailStore,
  questStore: QuestStore,
  personalStore: personalStore,
  schoolConfig: SchoolConfig,
  msgCenter: new PersonlStore()
};
