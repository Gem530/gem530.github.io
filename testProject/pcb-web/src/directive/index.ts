import resize from './common/resize';
import copyText from './common/copyText';
import loadmores from './common/loadmores';
import inputNumber from './common/inputNumber';
import { hasPermi,hasNotPermi, hasRoles } from './permission';
import { App } from 'vue';

export default (app: App) => {
  app.directive('resize', resize);
  app.directive('copyText', copyText);
  app.directive('loadmores', loadmores);
  app.directive('inputNumber', inputNumber);
  app.directive('hasNotPermi', hasNotPermi);
  app.directive('hasPermi', hasPermi);
  app.directive('hasRoles', hasRoles);
};
