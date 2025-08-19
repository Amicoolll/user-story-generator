export default function BrainIcon(props) {
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" {...props}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A5AE0"/>
            <stop offset="100%" stopColor="#22D3EE"/>
          </linearGradient>
        </defs>
        <path d="M100,10 C130,10,160,40,160,70 C180,80,190,110,180,140 C170,170,140,190,110,190 C80,190,50,170,40,140 C30,110,40,80,60,70 C60,40,90,10,100,10Z"
              stroke="url(#grad1)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="70" cy="80" r="5" fill="url(#grad1)" />
        <circle cx="130" cy="80" r="5" fill="url(#grad1)" />
        <circle cx="100" cy="50" r="5" fill="url(#grad1)" />
        <circle cx="100" cy="120" r="5" fill="url(#grad1)" />
        <line x1="70" y1="80" x2="100" y2="50" stroke="url(#grad1)" strokeWidth="3"/>
        <line x1="130" y1="80" x2="100" y2="50" stroke="url(#grad1)" strokeWidth="3"/>
        <line x1="70" y1="80" x2="100" y2="120" stroke="url(#grad1)" strokeWidth="3"/>
        <line x1="130" y1="80" x2="100" y2="120" stroke="url(#grad1)" strokeWidth="3"/>
      </svg>
    );
  }
  