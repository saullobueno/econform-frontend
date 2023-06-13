import React, { useState, useCallback, useRef } from 'react';
import { ClientMyAccount } from 'services';
import {
  chakra,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';

import { Loading } from 'components/Loading';
import { useAuth } from 'context/auth';

export default ({ id, isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const ref = useRef();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await ClientMyAccount.deleteItem(id);
      toast({
        title: 'Conta excluída',
        status: 'success',
        isClosable: true,
      });
      setLoading(false);
      signOut();
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Não foi possível excluir a conta.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
  }, [id, onClose]);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Excluir
          </AlertDialogHeader>

          {loading ? (
            <Loading />
          ) : (
            <>
              <AlertDialogBody>
                <Text>Tem certeza que deseja encerrar sua conta?</Text>
                <Text color="red.500" fontSize="sm" mt="4">
                  <chakra.span fontWeight="semibold">Importante: </chakra.span> Esta ação é irreverssível para você e
                  apenas os desenvolvedores conseguirão reverter esta ação.
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <ButtonGroup spacing="4">
                  <Button colorScheme="red" onClick={() => handleOnSubmit()}>
                    Excluir
                  </Button>
                  <Button colorScheme="grayBlue" variant="ghost" onClick={onClose}>
                    Fechar
                  </Button>
                </ButtonGroup>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
