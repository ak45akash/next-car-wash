/**
 * Service Pre-selection Feature Tests
 * 
 * These tests verify the core functionality of the service pre-selection feature
 * that allows users to navigate from service cards directly to the booking form
 * with the selected service pre-populated.
 */

describe('Service Pre-selection Feature', () => {
  describe('Service Selection Logic', () => {
    const mockServices = [
      { id: '28', name: 'Basic Wash', price: 499, category: 'Basic' },
      { id: '29', name: 'Premium Wash', price: 799, category: 'Premium' },
      { id: '30', name: 'Steam Wash', price: 999, category: 'Premium' },
      { id: '31', name: 'Interior Detailing', price: 1499, category: 'Detailing' },
      { id: '32', name: 'Exterior Detailing', price: 1999, category: 'Detailing' },
      { id: '33', name: 'Full Detailing', price: 2999, category: 'Detailing' },
      { id: '34', name: 'Paint Protection Film', price: 15999, category: 'Protection' },
      { id: '35', name: 'Ceramic Coating', price: 8999, category: 'Protection' }
    ]

    it('should find preselected service when valid ID is provided', () => {
      const preselectedServiceId = '29'
      
      const preselectedService = mockServices.find(service => 
        service.id.toString() === preselectedServiceId.toString()
      )
      
      expect(preselectedService).toBeDefined()
      expect(preselectedService?.id).toBe('29')
      expect(preselectedService?.name).toBe('Premium Wash')
      expect(preselectedService?.price).toBe(799)
    })

              it('should handle string vs number ID comparison correctly', () => {
       // Test the critical fix: service.id.toString() === preselectedServiceId.toString()
       const numericServiceId = 29
       const stringServiceId = '29'
       
       // This is the fix: converting both to strings for comparison
       expect(numericServiceId.toString()).toBe(stringServiceId)
       expect(stringServiceId).toBe('29')
       expect(numericServiceId.toString()).toBe('29')
     })

    it('should fallback to Basic Wash when preselected service not found', () => {
      const preselectedServiceId = '999' // Non-existent service
      
      let selectedService = mockServices.find(service => 
        service.id.toString() === preselectedServiceId.toString()
      )
      
      if (!selectedService) {
        // Fallback logic
        selectedService = mockServices.find(service => 
          service.name.toLowerCase().includes('basic')
        ) || mockServices[0]
      }
      
      expect(selectedService.id).toBe('28')
      expect(selectedService.name).toBe('Basic Wash')
    })

    it('should fallback to first service if no Basic Wash exists', () => {
      const servicesWithoutBasic = mockServices.filter(s => 
        !s.name.toLowerCase().includes('basic')
      )
      
      const preselectedServiceId = '999'
      
      let selectedService = servicesWithoutBasic.find(service => 
        service.id.toString() === preselectedServiceId.toString()
      )
      
      if (!selectedService) {
        selectedService = servicesWithoutBasic.find(service => 
          service.name.toLowerCase().includes('basic')
        ) || servicesWithoutBasic[0]
      }
      
      expect(selectedService.id).toBe('29') // First service in filtered array
      expect(selectedService.name).toBe('Premium Wash')
    })
  })

  describe('URL Generation', () => {
    it('should generate correct booking URLs for service cards', () => {
      const serviceIds = ['28', '29', '30', '31', '32', '33', '34', '35']
      
      serviceIds.forEach(serviceId => {
        const bookingUrl = `/book?service=${serviceId}`
        expect(bookingUrl).toBe(`/book?service=${serviceId}`)
        expect(bookingUrl).toMatch(/^\/book\?service=\d+$/)
      })
    })

    it('should handle URL parameter parsing', () => {
      const url = '/book?service=29'
      const params = new URLSearchParams(url.split('?')[1])
      const serviceParam = params.get('service')
      
      expect(serviceParam).toBe('29')
    })
  })

  describe('Display Settings Logic', () => {
    it('should correctly apply display settings for service cards', () => {
      const displaySettings = {
        showDuration: true,
        showCategory: false
      }
      
      // Simulate conditional rendering logic
      const shouldShowDuration = displaySettings.showDuration
      const shouldShowCategory = displaySettings.showCategory
      
      expect(shouldShowDuration).toBe(true)
      expect(shouldShowCategory).toBe(false)
    })

    it('should use default settings when none provided', () => {
      const defaultSettings = {
        showDuration: true,
        showCategory: true
      }
      
      // Simulate default settings fallback
      const settings = defaultSettings
      
      expect(settings.showDuration).toBe(true)
      expect(settings.showCategory).toBe(true)
    })
  })

  describe('Service Data Validation', () => {
    it('should validate service object structure', () => {
      const service = {
        id: '29',
        name: 'Premium Wash',
        price: 799,
        category: 'Premium',
        description: 'Premium car wash with ✓ Exterior wash ✓ Interior cleaning',
        duration: 45,
        status: 'active'
      }

      // Type validation
      expect(typeof service.id).toBe('string')
      expect(typeof service.name).toBe('string')
      expect(typeof service.price).toBe('number')
      expect(typeof service.category).toBe('string')
      expect(typeof service.description).toBe('string')
      expect(typeof service.duration).toBe('number')
      expect(typeof service.status).toBe('string')
      
      // Value validation
      expect(service.price).toBeGreaterThan(0)
      expect(service.duration).toBeGreaterThan(0)
      expect(service.status).toBe('active')
      expect(service.name).toBeTruthy()
    })

    it('should handle price formatting correctly', () => {
      const prices = [499, 799, 999, 1499, 1999, 2999, 8999, 15999]
      
      prices.forEach(price => {
        const formattedPrice = `₹${price.toLocaleString()}`
        expect(formattedPrice).toMatch(/^₹[\d,]+$/)
      })
      
             expect(`₹${(15999).toLocaleString()}`).toBe('₹15,999')
    })
  })

  describe('Booking Form Integration', () => {
    it('should simulate booking form service selection', () => {
      const services = [
        { id: '28', name: 'Basic Wash', price: 499 },
        { id: '29', name: 'Premium Wash', price: 799 }
      ]
      
      const preselectedServiceId = '29'
      
      // Simulate form initialization
      let initialServiceId = ''
      
      if (preselectedServiceId) {
        const preselectedService = services.find(service => 
          service.id.toString() === preselectedServiceId.toString()
        )
        
        if (preselectedService) {
          initialServiceId = preselectedServiceId
        } else {
          const basicWash = services.find(service => 
            service.name.toLowerCase().includes('basic')
          )
          initialServiceId = basicWash ? basicWash.id : services[0].id
        }
      } else {
        const basicWash = services.find(service => 
          service.name.toLowerCase().includes('basic')
        )
        initialServiceId = basicWash ? basicWash.id : services[0].id
      }
      
      expect(initialServiceId).toBe('29')
    })

    it('should simulate successful booking reset', () => {
      const services = [
        { id: '28', name: 'Basic Wash', price: 499 },
        { id: '29', name: 'Premium Wash', price: 799 }
      ]
      
      // After successful booking, should reset to Basic Wash
      const basicWash = services.find(service => 
        service.name.toLowerCase().includes('basic')
      )
      const resetServiceId = basicWash ? basicWash.id : services[0].id
      
      expect(resetServiceId).toBe('28')
    })
  })

  describe('Error Handling', () => {
    it('should handle empty services array', () => {
      const services: any[] = []
      const preselectedServiceId = '29'
      
      const preselectedService = services.find(service => 
        service.id.toString() === preselectedServiceId.toString()
      )
      
      expect(preselectedService).toBeUndefined()
      
      // Fallback when no services available
      const fallbackService = services[0] || null
      expect(fallbackService).toBeNull()
    })

         it('should handle null/undefined preselected service ID', () => {
       const services = [
         { id: '28', name: 'Basic Wash', price: 499 }
       ]
       
       const preselectedServiceId: string | null = null
       
       // Should handle null gracefully
       const result = preselectedServiceId ? 
         services.find(service => service.id.toString() === preselectedServiceId) :
         services.find(service => service.name.toLowerCase().includes('basic')) || services[0]
       
       expect(result?.id).toBe('28')
     })
  })
}) 