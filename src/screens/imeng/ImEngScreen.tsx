import { useNavigation, type NavigationProp } from '@react-navigation/native';

import { createExamCatalogScreen } from '../exam/createExamScreens';
import type { RootStackParamList } from '../../../App';

const useRootNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();

export default createExamCatalogScreen({
	examId: 'imeng',
	routes: {
		questionRouteName: 'ImEngQuestion',
	},
	useNavigationHook: useRootNavigation,
});
