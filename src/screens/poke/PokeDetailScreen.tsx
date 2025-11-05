import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import { createExamModulesScreen } from '../exam/createExamScreens';
import type { RootStackParamList } from '../../../App';

const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
const usePokeDetailRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PokeDetail'>>();
  return { params: route.params };
};

export default createExamModulesScreen({
  examId: 'poke',
  routes: {
    questionRouteName: 'PokeQuestion',
  },
  useNavigationHook: useRootNavigation,
  useRouteHook: usePokeDetailRoute,
});
