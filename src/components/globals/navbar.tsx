import React from 'react'
import { Navbar, Button, Text, Link } from '@nextui-org/react'

export default function NavbarComponent() {
  return (
    <Navbar variant={'floating'}>
        <Navbar.Brand>
            <Text weight={'bold'}> prompt.dev </Text>
        </Navbar.Brand>
        <Navbar.Content activeColor={'secondary'}>
            <Navbar.Link href="#" isActive>Home</Navbar.Link>
            <Navbar.Link href="#">Skills</Navbar.Link>
            <Navbar.Link href="#">AIs</Navbar.Link>            
            <Navbar.Link href="#">About</Navbar.Link>
            <Navbar.Link href="#">Contact</Navbar.Link>            
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Link color="inherit" href="#">
            Login
          </Navbar.Link>
          <Navbar.Item>
            <Button auto flat as={Link} color={'secondary'} href="#">
              Sign Up
            </Button>
          </Navbar.Item>
        </Navbar.Content>
    </Navbar>
  )
}
