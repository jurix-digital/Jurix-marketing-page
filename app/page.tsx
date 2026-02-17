'use client'; // Required for Framer Motion

import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import { Albert_Sans } from 'next/font/google';
import ContactForm from '@/components/ContactForm';
import { motion, easeOut } from 'framer-motion';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-albert-sans',
});

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: easeOut } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: easeOut } 
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[700px] md:h-[600px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="w-full h-full relative"
        >
          {/* Desktop Banner */}
          <div className="hidden lg:block absolute inset-0">
            <Image
              src="/jurix-desktop-banner.png"
              alt="Jurix - AI platform for legal connections across India"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Mobile Banner */}
          <div className="lg:hidden absolute inset-0">
            <Image
              src="/jurix-mobile-banner.png"
              alt="Jurix - AI platform for legal connections across India"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 md:py-20 md:px-8 bg-[#F3F2F1]">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[45%_55%] items-start gap-8 lg:gap-0">
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 
                variants={fadeInUp}
                className={`${albertSans.className} font-[300] text-[32px] md:text-[48px] leading-[38px] md:leading-[50px] text-[#2D3136] mb-6 md:mb-10 letter-spacing-[0]`}
              >
                Want to be the first to
                <br />
                know more?{' '}
                <span className="text-[#24396A] font-[600]">
                  Secure
                  <br />
                  your place now.
                </span>
              </motion.h2>

              <div className="space-y-6 md:space-y-8">
                {/* Email */}
                <motion.div variants={fadeInUp} className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EBE1CC] flex items-center justify-center">
                    <Image
                      src="/jurix-mail-icon.svg"
                      alt="Email icon"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <p className={`${albertSans.className} text-[12px] md:text-[14px] tracking-[0] text-[#927A61] mb-0`}>
                      Email id
                    </p>
                    <p className={`${albertSans.className} text-[16px] md:text-[18px] text-[#282828]`}>
                      hello@jurix.law
                    </p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={fadeInUp} className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EBE1CC] flex items-center justify-center">
                    <Image
                      src="/jurix-call-icon.svg"
                      alt="Phone icon"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <p className={`${albertSans.className} text-[12px] md:text-[14px] tracking-[0] text-[#927A61] mb-0`}>
                      Phone number
                    </p>
                    <p className={`${albertSans.className} text-[16px] md:text-[18px] text-[#282828]`}>
                      +91 81 4444 6464
                    </p>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div variants={fadeInUp} className="flex items-top gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EBE1CC] flex items-center justify-center">
                    <Image
                      src="/jurix-location-icon.svg"
                      alt="Location icon"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className='w-[60%]'>
                    <p className={`${albertSans.className} text-[12px] md:text-[14px] tracking-[0] text-[#927A61] mb-0`}>
                      Office Address
                    </p>
                    <p className={`${albertSans.className} text-[16px] md:text-[18px] text-[#282828]`}>
                      HIG-66,
                      Tatvamasi Nilayam,
                      KPHB 9th Phase Road,
                      KPHB Colony,
                      Hyderabad,
                      Medchal Malkajgiri,
                      Telangana,
                      500072
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Form (Slide In) */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 md:py-8 md:px-6" style={{ background: 'linear-gradient(129.78deg, #2F3030 4.51%, #141618 96.04%)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-center gap-3 mb-4 border-b border-[#323435] pb-4">
            <Image src="/jurix-logo.svg" alt="Jurix Logo" width={280} height={105} className="w-auto h-auto max-w-[200px] lg:max-w-[280px]" />
          </div>
          {/* Updated Footer Inner */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 md:gap-0">
            <Link 
              href="/privacy-policy" 
              className={`${albertSans.className} text-[#E6DDCC] text-[14px] hover:text-white transition-colors`}
            >
              Privacy Policy
            </Link>
            <span className={`${albertSans.className} text-[#E6DDCC] text-[14px]`}> 
              © 2026 Jurix. All Rights Reserved.
            </span>
          </div>
        </motion.div>
      </footer>
    </main>
  );
}