'use client';
import React from 'react'
import { Container, Row, Col, Button, Input, Card, Text } from '@nextui-org/react';

export default function Search() {
  return (
    <Container>
        <Row>
            <Input placeholder="What do you want to improve from AI..." css={{width: '100%'}}/>
            <Button auto flat color={'primary'}>Search</Button>
        </Row>
    </Container>        
  )
}
