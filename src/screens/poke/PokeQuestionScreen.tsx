import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import { createExamQuestionScreen } from '../exam/createExamScreens';
import type { RootStackParamList } from '../../../App';

const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
const usePokeQuestionRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PokeQuestion'>>();
  return { params: route.params };
};

export default createExamQuestionScreen({
  examId: 'poke',
  useNavigationHook: useRootNavigation,
  useRouteHook: usePokeQuestionRoute,
});
