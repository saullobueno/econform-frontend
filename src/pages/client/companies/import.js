import React, { useCallback, useState } from 'react';
import nprogress from 'nprogress';
import { ClientCompany } from 'services';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {
  chakra,
  useToast,
  Button,
  ButtonGroup,
  Box,
  VStack,
  HStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from '@chakra-ui/react';

import Modal from 'components/Modal';
import { Input } from 'components/Forms/Input';

const schema = Yup.object({
  file: Yup.mixed().required('Escolha um arquivo Excel para ser lido pela plataforma.'),
});

export default ({ isOpen, onClose = () => {} }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [imports, setImports] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = useCallback(async () => {
    nprogress.start();
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await ClientCompany.importItem(formData);
      setImports(data);
      toast({
        title: 'Arquivo importado',
        description: 'Confira os resultados em tela.',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível criar as empresas com todos ou algum(ns) dos CNPJs da listagem.',
        description: error.response.data.message
          ? error.response.data.message
          : 'Motivo desconhecido. Entre em contato conosco para relatar este impedimento.',
        status: 'error',
        isClosable: true,
      });
    }
    nprogress.done();
  }, [onClose, file]);

  const handleClose = () => {
    onClose();
    setImports([]);
  };
  return (
    <Modal
      title="Importar CNPJs"
      isOpen={isOpen}
      onClose={handleClose}
      isSubmitting={isSubmitting}
      footer={
        <ButtonGroup spacing="4">
          <Button type="submit" form="formRef" isLoading={isSubmitting}>
            Importar
          </Button>
          <Button colorScheme="grayBlue" variant="ghost" onClick={handleClose}>
            Fechar
          </Button>
        </ButtonGroup>
      }
    >
      <VStack as="form" id="formRef" onSubmit={handleSubmit(handleOnSubmit)} spacing="4">
        <Text>Aqui você poderá fazer upload de uma planilha Excel que contenha uma lista de vários CNPJs.</Text>
        <Text color="gray.400" fontSize="sm" mt="4">
          <chakra.span fontWeight="semibold">Importante:</chakra.span> Os CNPJs devem ficar na primeira coluna da
          planilha, cada um em uma célula.
        </Text>
        <Input
          name="file"
          type="file"
          label="Arquivo"
          onChange={(e) => onChange(e)}
          errors={errors}
          register={register}
        />
      </VStack>
      {imports?.sent > 0 && (
        <>
          <Divider my="4" />
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color="gray.400" ms="4">
              Resultado
            </Text>
            <Text m="4">
              <chakra.strong>{imports.sent}</chakra.strong> CNPJs enviados
            </Text>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton color="green.500">
                    <Box as="span" flex="1" textAlign="left">
                      {imports.success} cadastrados
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} fontSize="sm">
                  {imports.items.map(
                    (itemSuccess) =>
                      itemSuccess.code === 'success' && (
                        <HStack>
                          <Text>
                            {itemSuccess.cnpj} - {itemSuccess.message}
                          </Text>
                        </HStack>
                      )
                  )}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton color="red.500">
                    <Box as="span" flex="1" textAlign="left">
                      {imports.error} não cadastrados
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} fontSize="sm">
                  {imports.items.map(
                    (itemError) =>
                      itemError.code === 'error' && (
                        <HStack>
                          <Text>
                            {itemError.cnpj} - {itemError.message}
                          </Text>
                        </HStack>
                      )
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </>
      )}
    </Modal>
  );
};
