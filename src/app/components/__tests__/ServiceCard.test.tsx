import React from 'react'
import { render, screen } from '@testing-library/react'
import ServiceCard from '../ServiceCard'
import type { Service, DisplaySettings } from '@/types'

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

const mockService: Service = {
  id: '29',
  name: 'Premium Wash',
  price: 799,
  category: 'Premium',
  description: 'Premium car wash with ✓ Exterior wash ✓ Interior cleaning ✓ Tire shine',
  duration: 45,
  status: 'active'
}

const mockDisplaySettings: DisplaySettings = {
  showDuration: true,
  showCategory: true
}

describe('ServiceCard', () => {
  it('renders service information correctly', () => {
    render(<ServiceCard service={mockService} displaySettings={mockDisplaySettings} />)

    expect(screen.getByText('Premium Wash')).toBeDefined()
    expect(screen.getByText('₹799')).toBeDefined()
    expect(screen.getByText('Premium')).toBeDefined()
  })

  it('generates correct booking link with service ID', () => {
    render(<ServiceCard service={mockService} displaySettings={mockDisplaySettings} />)

    const bookNowLink = screen.getByRole('link', { name: /book now/i })
    expect(bookNowLink.getAttribute('href')).toBe('/book?service=29')
  })

  it('hides duration when displaySettings.showDuration is false', () => {
    const settings = { ...mockDisplaySettings, showDuration: false }
    render(<ServiceCard service={mockService} displaySettings={settings} />)

    expect(screen.queryByText(/45/)).toBeNull()
  })

  it('hides category when displaySettings.showCategory is false', () => {
    const settings = { ...mockDisplaySettings, showCategory: false }
    render(<ServiceCard service={mockService} displaySettings={settings} />)

    expect(screen.queryByText('Premium')).toBeNull()
  })

  it('renders with default image when no image is provided', () => {
    render(<ServiceCard service={mockService} displaySettings={mockDisplaySettings} />)

    const image = screen.getByRole('img', { name: /premium wash/i })
    expect(image).toBeDefined()
    expect(image.getAttribute('src')).toContain('car-wash.jpg')
  })

  it('handles service with custom image', () => {
    const serviceWithImage = { ...mockService, image_url: '/images/premium-wash.jpg' }
    render(<ServiceCard service={serviceWithImage} displaySettings={mockDisplaySettings} />)

    const image = screen.getByRole('img', { name: /premium wash/i })
    expect(image.getAttribute('src')).toContain('premium-wash.jpg')
  })

  it('renders price in correct format', () => {
    const expensiveService = { ...mockService, price: 15999 }
    render(<ServiceCard service={expensiveService} displaySettings={mockDisplaySettings} />)

    expect(screen.getByText('₹15,999')).toBeDefined()
  })
}) 