import { initialize } from './datasource';
import { Apollo } from './apollo';

const init = async () => {
  await initialize();
  await Apollo.initialize();
};

init();
