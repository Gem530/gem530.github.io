import copyText from './common/copyText';
import loadmores from './common/loadmores';
import { hasPermi,hasNotPermi, hasRoles } from './permission';
import { App } from 'vue';

export default (app: App) => {
  app.directive('copyText', copyText);
  app.directive('loadmores', loadmores);
  app.directive('hasNotPermi', hasNotPermi);
  app.directive('hasPermi', hasPermi);
  app.directive('hasRoles', hasRoles);
};
