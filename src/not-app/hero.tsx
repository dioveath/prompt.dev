import { Container, Col, Row, Button, Text } from '@nextui-org/react'
import React from 'react'

export default function Hero() {
  return (
    <Container alignItems='center' justify='center' css={{padding: '$20'}}>
        <Col>
            <Text h1 size={'30px'} weight={'bold'}> Prompt the AI </Text>
            <Text size='20px'> The next big skill of new generation. Teach yourself to prompt an AI. </Text>
        </Col>
        <Button size={'lg'} color={'secondary'} auto flat> Explore Now </Button>
    </Container>        
  )
}
