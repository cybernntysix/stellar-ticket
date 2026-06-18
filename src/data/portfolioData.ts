export interface DocSection {
  sectionHeading?: string;
  title?: string;
  paragraphs: string[];
  images?: string[];
}

export interface PortfolioDocument {
  id: string;
  title: string;
  subtitle: string;
  pdfUrl: string;
  iconType: 'FileText' | 'Award' | 'HardDrive' | 'MonitorPlay';
  content: DocSection[];
}

export const PORTFOLIO_DOCS: PortfolioDocument[] = [
  {
    id: 'ticketing-systems',
    title: 'TICKETING SYSTEMS PORTFOLIO',
    subtitle: 'A comprehensive breakdown of enterprise ticketing architectures, workflows, and SLA management.',
    pdfUrl: '/assets/dossier/documentation/ticketing-systems/PORTFOLIO-Understanding-Ticketing-Systems.pdf',
    iconType: 'FileText',
    content: [
      {
        title: 'What information should a user provide when creating a ticket?',
        paragraphs: ["When a user creates a ticket they should describe the experience of the client and their problem needing to be resolved. The documentation should include the client's name, details of the issue, whatever is needed to access the machine, and a clear description of what information was gathered during their conversation. They should also document whatever decisions were made to try and fix the issue if there were any steps taken."]
      },
      {
        title: 'Why is it important to categorize tickets?',
        paragraphs: ["It's important to categorize tickets because we need to resolve tickets in the order of impact or reach and to imply the escalation level if it has not already been assigned/claimed by that Support team. It gives clarity on which tickets to prioritize other than the SLA timing. Also it is important for organizational purposes because there can be a lot of tickets coming in sometimes depending on the state of the organization. So it's good to have categorization to keep a birds eye view on what sort of tickets are coming in and it can reveal a larger, more connected issue than just there being a lot of individual tickets coming in. This gives you the ability to get to the core of an issue that resolves multiple tickets at once saving companies a lot of time."]
      },
      {
        title: 'What happens after a ticket is submitted?',
        paragraphs: ["After a ticket is submitted by a client, the IT Support team will get them into a queue where we read the tickets and decide whether we will claim that ticket, assign it to a team member, or escalate the ticket to Level 2 Support. Once we do receive the ticket we speak with the client to gather clarifying information about the problem and determine as much as we can so we can resolve and close the ticket or escalate it to the proper team that can handle it. If we escalate the ticket after gathering information, we document and communicate the task to the team we assigned the ticket to and keep the ticket open."]
      },
      {
        title: 'What happens when a ticket is resolved?',
        paragraphs: ["When tickets are resolved we make sure that all of the steps from information gathering, theorizing, troubleshooting theories, and testing solutions are all documented properly. Once the ticket is resolved, closed, and everything is working properly make sure to always send a professional statement of the resolution to the client."]
      },
      {
        title: 'Why should ticket history be preserved?',
        paragraphs: ["Tickets having so much useful documentation is crucial when it comes to ticket history because there are going to be repeated issues that can be referenced from past tickets. This data is vital for efficiency and effective use of our previous efforts to make sure that we work smart and keep ourselves and other teams fresh for truly unique problems and issues. Over time this could turn into a full Knowledge Base of guidance that clients could use without even needing our help and it can provide team members the ability to work more autonomously, empowering even new team members."]
      },
      {
        title: 'What are internal notes used for?',
        paragraphs: ["When tickets have internal notes, these can give us the ability to communicate faster than emails to other team members throughout tickets' lifespan, while keeping all of the communication attached and in one place, easy to see. It is clean, saves time navigating, and can help with nuance for tickets of the similar variety."]
      },
      {
        sectionHeading: 'User Roles',
        title: 'What should an IT Support technician be able to do?',
        paragraphs: ["IT Support should be able to claim, assign, create, and escalate tickets. They should also be able to create Knowledge Base insights, they should be able to reply to tickets and communicate with clients and the Level 2 Support teams. IT Support is responsible for gathering the information, for resolving tickets within their role's scope and to make sure that pristine details and communication towards the resolution is handled in an orderly manner."]
      },
      {
        title: 'Why might a Cybersecurity Analyst need access to ticket information?',
        paragraphs: ["A Cybersecurity team member would use the ticket information for them to interpret a solution based on the problem's details and the communication between IT Support and the client."]
      },
      {
        title: 'Why is role-based access important?',
        paragraphs: ["Practicing the principle of Least Privilege allows scope and responsibility to remain clear, making sure there is no confusion or ability to go outside of the necessary chain of custody. Also it can further prevent human error and vulnerabilities inside of an organization."]
      },
      {
        title: 'What metrics would help a manager monitor support performance?',
        paragraphs: ["The metrics managers use need to measure how efficiently the IT team is working to resolve tickets. The main metrics they'd be monitoring are the number of open tickets, average response time, average resolution time, first-contact resolution rate, backlog size, SLA compliance, technician workload, ticket reopen rate, and customer satisfaction. These metrics help identify bottlenecks, balance workloads, improve service quality, and ensure users receive timely support."]
      },
      {
        sectionHeading: 'Project Overview',
        title: 'What problem were you trying to solve when you decided to build Stellar Ticket?',
        paragraphs: ["The intention of Stellar Ticket was to build every piece of the ticketing system as a way to design the elements, the procedures, and the operations of an enterprise IT Support environment. With AI, this has been a new way to get an understanding of the systems, concepts, and procedures that make ticketing systems effective. I wanted to create a ticketing system that resembled its impact and allow me to see from the perspective of Level 2 Support and the cybersecurity perspective."]
      },
      {
        title: 'Who would use this system in a real company?',
        paragraphs: ["In a real company, the IT Support and Cybersecurity professionals could use Stellar Ticket as a way to bring life to a lot of the redundant tasks of ticketing systems. I would hope to gamify and make the work more engaging while maintaining efficiency and even optimizing some of the functionality of the software in comparison to a lot of the ticketing systems I see that are still widely used today."]
      },
      {
        title: 'Why would someone use Stellar Ticket instead of email?',
        paragraphs: ["Stellar Ticket allows for seamless visualization of IT Support operations, role-based access, ticket lifecycle management, event logging, dashboards, knowledge base integration, and department workflows. Also the actual GUI for user experience is important for Stellar Ticket, modular parts to keep users engaged."]
      },
      {
        title: 'What makes Stellar Ticket different from a basic ticketing system?',
        paragraphs: ["It is designed to fit the user based on their preferences or the agreement of their own teams. It continuously iterates features and offers deeper customization to users who desire that. Each teams' version of the application can look different depending on their needs and objectives."]
      }
    ]
  },
  {
    id: 'desktop-assembly',
    title: 'DESKTOP COMPUTER ASSEMBLY AND VERIFICATION',
    subtitle: 'Hands-on IT hardware lab covering desktop assembly, CPU/RAM installation, and system verification.',
    pdfUrl: '/assets/dossier/documentation/desktop-assembly/PORTFOLIO Desktop Computer Assembly and Verification.pdf',
    iconType: 'HardDrive',
    content: [
      {
        title: 'Project Overview',
        paragraphs: [
          "For this project, I assembled a desktop computer and verified that it worked after putting the parts back together. This was a hands-on hardware lab where I worked with the main internal parts of a desktop, including the motherboard, CPU, CPU cooler, RAM, storage, power supply, and internal cables."
        ],
        images: [
          '/assets/dossier/documentation/desktop-assembly/page_11_image_01.png',
          '/assets/dossier/documentation/desktop-assembly/page_13_image_01.png'
        ]
      },
      {
        title: 'Work Performed',
        paragraphs: [
          "1. I started by setting up the workspace and making sure the parts, screws, and tools were available. I also followed anti-static precautions because I was handling internal computer components.",
          "2. I installed the CPU onto the motherboard and made sure it was lined up correctly before locking it into place. I avoided touching the pins or conductive areas to make sure I didn't damage anything.",
          "3. After that, I worked on the CPU cooler. I cleaned the contact area, and we didn't have thermal paste but I would have added some if we did. Also I mounted the cooler and connected the cooler cable to the CPU fan header on the motherboard.",
          "4. Next, I installed the RAM. The system had 2 RAM modules, so I lined them up with the notches in the slots and pressed them down until they were fully seated and locked in place. I made sure they were in the appropriate slots to enable Dual Channel mode in the BIOS.",
          "5. Once the main parts were installed on the motherboard, I placed the motherboard into the desktop case. I lined it up with the case openings and screw holes, then secured it with the correct screws.",
          "6. I also worked on the front-panel connections, including the power button, LED indicators, USB, and audio connections.",
          "7. I installed and connected the storage device, then connected the needed power and data cables. I checked the inside of the case before powering it on to make sure the hardware was seated correctly and the cables were not blocking anything important.",
          "8. After everything was connected, I plugged in the monitor, keyboard, mouse, and power cable. Then I powered on the computer to verify that the system worked after being assembled."
        ],
        images: [
          '/assets/dossier/documentation/desktop-assembly/page_19_image_01.png',
          '/assets/dossier/documentation/desktop-assembly/page_23_image_01.png'
        ]
      },
      {
        title: 'Troubleshooting / Quality Checks',
        paragraphs: [
          "• Checked that the CPU was installed in the correct orientation.",
          "• Made sure the CPU cooler was mounted securely and connected the CPU fan header. Verified the RAM was fully seated in place.",
          "• Checked motherboard alignment before tightening screws.",
          "• Reviewed cable connections before powering on the system.",
          "• Verified the computer powered on after assembly."
        ],
        images: [
          '/assets/dossier/documentation/desktop-assembly/page_25_image_01.png',
          '/assets/dossier/documentation/desktop-assembly/page_26_image_01.png'
        ]
      }
    ]
  }
];