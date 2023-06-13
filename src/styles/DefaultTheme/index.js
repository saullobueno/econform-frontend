import { extendTheme } from '@chakra-ui/react';
import styles from './styles';

// FOUNDATIONS
import breakpoints from './foundations/breakpoints';
import colors from './foundations/colors';
import fonts from './foundations/fonts';
import fontSizes from './foundations/fontSizes';

// COMPONENTS
import Button from './components/button';
import Badge from './components/badge';
import Form from './components/form';
import FormLabel from './components/form-label';
import Input from './components/input';
import NumberInput from './components/number-input';
import Textarea from './components/textarea';
import Radio from './components/radio';
import Checkbox from './components/checkbox';
import Modal from './components/modal';
import Table from './components/table';

export const theme = extendTheme({
  breakpoints,
  styles,
  colors,
  fonts,
  fontSizes,
  components: {
    Button,
    Badge,
    Form,
    FormLabel,
    Input,
    NumberInput,
    Textarea,
    Radio,
    Checkbox,
    Modal,
    Table,
  },
});
