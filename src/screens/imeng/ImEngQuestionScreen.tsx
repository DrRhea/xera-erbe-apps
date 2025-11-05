import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import { createExamQuestionScreen } from '../exam/createExamScreens';
import type { RootStackParamList } from '../../../App';

const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
const useImEngQuestionRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ImEngQuestion'>>();
  return { params: route.params };
};

export default createExamQuestionScreen({
  examId: 'imeng',
  useNavigationHook: useRootNavigation,
  useRouteHook: useImEngQuestionRoute,
});
