import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import { createExamModulesScreen } from '../exam/createExamScreens';
import type { RootStackParamList } from '../../../App';

const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
const useSnackbtDetailRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SnackbtDetail'>>();
  return { params: route.params };
};

export default createExamModulesScreen({
  examId: 'snackbt',
  routes: {
    questionRouteName: 'SnackbtQuestion',
  },
  useNavigationHook: useRootNavigation,
  useRouteHook: useSnackbtDetailRoute,
});
