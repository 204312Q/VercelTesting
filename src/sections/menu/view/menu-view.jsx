'use client';

import MenuCalendar from '../menu-calendar';
import { MenuHero } from '../menu-hero';
import { MenuPopular } from '../menu-popular';
import { MenuNextStep } from '../menu-next-steps';
// Remove the MenuViewSkeleton import

export function MenuView() {
    // Remove loading state from here
    return (
        <>
            <MenuHero />
            <MenuCalendar />
            <MenuPopular />
            <MenuNextStep />
        </>
    ); ``
}