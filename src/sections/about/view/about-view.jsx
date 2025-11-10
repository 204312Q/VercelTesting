'use client';

import { AboutViewPackage } from '../about-viewpackage';
import { AboutWhat } from '../about-what';
import { AboutVision } from '../about-vision';
import { AboutTestimonials } from '../about-testimonials';

// ----------------------------------------------------------------------

export function AboutView() {
  return (
    <>

      <AboutVision />
      <AboutWhat />
      <AboutViewPackage />
      <AboutTestimonials />
    </>
  );
}
