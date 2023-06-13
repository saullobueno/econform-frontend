import React, { useState, useCallback, useRef } from 'react';
import { ClientCompany } from 'services';
import { useNavigate } from 'react-router-dom';
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
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';

import { Loading } from 'components/Loading';

export default ({ id, isOpen = false, onClose = () => {} }) => {
  let navigate = useNavigate();
  const toast = useToast();
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('0');

  const handleOnSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await ClientCompany.deleteItem(id).then(() => navigate('/client/companies', { replace: true }));
      toast({
        title: 'Empresa excluída',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Não foi possível excluir esta empresa.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
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
                <Text>Tem certeza que deseja excluir esta empresa?</Text>
                <RadioGroup onChange={setConfirmDelete} value={confirmDelete} my="4">
                  <Stack direction="row" spacing="4">
                    <Radio value="1">Sim</Radio>
                    <Radio value="0">Não</Radio>
                  </Stack>
                </RadioGroup>
                <Text color="red.500" fontSize="sm" mt="4">
                  <chakra.span fontWeight="semibold">Importante: </chakra.span> Esta ação é irreverssível e todos os
                  CNPJs, licenças e documentos cadastrados nesta empresa serão perdidos.
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <ButtonGroup spacing="4">
                  <Button colorScheme="red" onClick={() => handleOnSubmit()} isDisabled={!Number(confirmDelete)}>
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
