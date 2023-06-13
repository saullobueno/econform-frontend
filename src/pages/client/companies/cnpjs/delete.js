import React, { useCallback, useRef, useState } from 'react';
import { ClientCompany } from 'services';

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
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';

import { Loading } from 'components/Loading';

export default ({ id, companyId, registrationCode, isOpen = false, onClose = () => {} }) => {
  const toast = useToast();
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('0');

  const handleOnSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await ClientCompany.cnpjDeleteItem(companyId, { data: { registrationCode } });
      toast({
        title: 'CNPJ excluído',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Não foi possível excluir o CNPJ.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    setLoading(false);
  }, [onClose, companyId, id, registrationCode]);

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
                <Text>Tem certeza que deseja excluir este item?</Text>

                <RadioGroup onChange={setConfirmDelete} value={confirmDelete} my="4">
                  <Stack direction="row" spacing="4">
                    <Radio value="1">Sim</Radio>
                    <Radio value="0">Não</Radio>
                  </Stack>
                </RadioGroup>
                <Text color="red.500" fontSize="sm" mt="4">
                  <chakra.span fontWeight="semibold">Importante: </chakra.span> Esta ação é irreverssível e todos os
                  dados relacionados ao mesmo serão perdidos.
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
