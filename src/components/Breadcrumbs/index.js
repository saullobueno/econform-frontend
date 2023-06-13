import React from 'react';
import { Link as LinkRouterDom } from 'react-router-dom';
import { Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react';

export default function Breadcrumbs({ pages, title, ...rest }) {
  return (
    <Flex h={['auto', '70px']} align="center" mb={['4', '0']} {...rest}>
      <Breadcrumb
        separator={
          <Text color="grayBlue.300" align="center">
            /
          </Text>
        }
      >
        {pages &&
          pages.map(
            (page, i) =>
              page.page && (
                <BreadcrumbItem key={i} fontSize="xs" color="blue.400" onClick={page.onclick || null}>
                  {page.link ? (
                    <BreadcrumbLink as={LinkRouterDom} to={page.link} textTransform="capitalize">
                      {typeof page.page === 'string' ? page.page.toLowerCase() : page.page}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink cursor="initial" textTransform="capitalize">
                      {typeof page.page === 'string' ? page.page.toLowerCase() : page.page}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
          )}
        <BreadcrumbItem isCurrentPage fontSize="xs" color="grayBlue.600">
          <BreadcrumbLink as={LinkRouterDom} to="#" textTransform="capitalize" _hover={{ textDecoration: 'none' }}>
            {typeof title === 'string' ? title?.toLowerCase() : title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  );
}
