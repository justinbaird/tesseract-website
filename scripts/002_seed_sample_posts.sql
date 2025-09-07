-- Insert sample posts for the portfolio
INSERT INTO posts (title, slug, excerpt, content, image_url, category, tags, status, featured, published_at) VALUES
(
  'Blockchain Technology Interface',
  'blockchain-technology-interface',
  'A modern interface design for blockchain technology applications with clean aesthetics and intuitive user experience.',
  'This project showcases a comprehensive blockchain technology interface designed with modern UI/UX principles. The interface features clean lines, intuitive navigation, and a professional aesthetic that makes complex blockchain concepts accessible to users.

Key features include:
- Real-time transaction monitoring
- Wallet integration capabilities
- Smart contract interaction panels
- Responsive design for all devices
- Dark mode optimization

The design process involved extensive user research and iterative prototyping to ensure the interface meets the needs of both novice and experienced blockchain users.',
  '/blockchain-technology-interface.png',
  'UI/UX Design',
  ARRAY['blockchain', 'interface', 'fintech', 'web design'],
  'published',
  true,
  NOW() - INTERVAL '30 days'
),
(
  'AI Research Platform',
  'ai-research-platform',
  'An innovative platform design for AI research collaboration featuring advanced data visualization and team collaboration tools.',
  'This AI research platform represents a cutting-edge approach to collaborative research in artificial intelligence. The platform combines sophisticated data visualization with seamless team collaboration features.

Project highlights:
- Advanced data visualization dashboards
- Real-time collaboration tools
- Machine learning model comparison interfaces
- Research paper management system
- Interactive data exploration tools

The platform was designed to streamline the research process and facilitate knowledge sharing among AI researchers worldwide.',
  '/ai-research-woman.png',
  'Product Design',
  ARRAY['AI', 'research', 'collaboration', 'data visualization'],
  'published',
  true,
  NOW() - INTERVAL '45 days'
),
(
  'Mobile Banking App Redesign',
  'mobile-banking-app-redesign',
  'Complete redesign of a mobile banking application focusing on user experience and accessibility improvements.',
  'This project involved a complete overhaul of a legacy mobile banking application. The redesign focused on improving user experience, accessibility, and security while maintaining compliance with financial regulations.

Design improvements include:
- Simplified navigation structure
- Enhanced security features
- Improved accessibility compliance
- Modern visual design language
- Streamlined transaction flows
- Biometric authentication integration

The new design resulted in a 40% increase in user engagement and significantly improved customer satisfaction scores.',
  '/placeholder.svg?height=400&width=600',
  'Mobile Design',
  ARRAY['mobile', 'banking', 'fintech', 'UX'],
  'published',
  false,
  NOW() - INTERVAL '60 days'
);
