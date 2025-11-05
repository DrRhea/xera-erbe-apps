import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import { createExamQuestionScreen } from '../exam/createExamScreens';
import type { RootStackParamList } from '../../../App';

const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
const useSnackbtQuestionRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SnackbtQuestion'>>();
  return { params: route.params };
};

export default createExamQuestionScreen({
  examId: 'snackbt',
  useNavigationHook: useRootNavigation,
  useRouteHook: useSnackbtQuestionRoute,
});
