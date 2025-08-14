import { memo, forwardRef } from 'react';

import SvgIcon from '@mui/material/SvgIcon';

import { BackgroundShape } from './background-shape';

const OrderFailedIllustration = forwardRef((props, ref) => {
    const { hideBackground, sx, ...other } = props;

    return (
        <SvgIcon
            ref={ref}
            viewBox="0 0 480 360"
            xmlns="http://www.w3.org/2000/svg"
            sx={[
                (theme) => ({
                    '--error-light': theme.vars.palette.error.light,
                    '--error-main': theme.vars.palette.error.main,
                    '--error-dark': theme.vars.palette.error.dark,
                    '--error-darker': theme.vars.palette.error.darker,
                    width: 320,
                    maxWidth: 1,
                    flexShrink: 0,
                    height: 'auto',
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            {!hideBackground && <BackgroundShape />}

            {/* Shopping Cart Handle */}
            <path
                fill="#DFE3E8"
                d="M253.579 162.701a5.06 5.06 0 01-4.861-3.646l-15.033-53.327a16.19 16.19 0 00-15.276-12.007h-78.471a16.174 16.174 0 00-15.325 11.995l-14.985 53.29a5.06 5.06 0 01-6.164 3.266 5.055 5.055 0 01-3.558-6l14.985-53.291a26.31 26.31 0 0125.047-19.347h78.471a26.327 26.327 0 0124.998 19.36l14.985 53.29a5.054 5.054 0 01-3.5 6.222 4.786 4.786 0 01-1.313.195z"
            />

            {/* Shopping Cart Body */}
            <path
                fill="url(#paint0_linear_failed)"
                d="M244.501 272.368H113.846a10.329 10.329 0 01-10.245-9.017l-12.153-95.716H266.85l-12.153 95.716a10.3 10.3 0 01-10.196 9.017z"
            />

            {/* Shopping Cart Top Rim */}
            <path
                fill="url(#paint1_linear_failed)"
                d="M268.151 155.117H90.196c-5.631 0-10.196 4.565-10.196 10.196v.887c0 5.632 4.565 10.197 10.196 10.197h177.955c5.631 0 10.196-4.565 10.196-10.197v-.887c0-5.631-4.565-10.196-10.196-10.196z"
            />

            {/* Shopping Cart Vertical Lines */}
            <path
                fill="var(--error-darker)"
                d="M128.66 184.017h-.012a7.874 7.874 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.875 7.875 0 007.875-7.875v-58.431a7.875 7.875 0 00-7.875-7.875zM162.335 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.876 7.876 0 007.876-7.875v-58.431a7.875 7.875 0 00-7.876-7.875zM196.023 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.876 7.876 0 007.876-7.875v-58.431a7.875 7.875 0 00-7.876-7.875zM229.699 184.017h-.012a7.875 7.875 0 00-7.875 7.875v58.431a7.875 7.875 0 007.875 7.875h.012a7.875 7.875 0 007.875-7.875v-58.431a7.875 7.875 0 00-7.875-7.875z"
            />

            {/* Shopping Cart Handle Bar */}
            <path
                fill="url(#paint2_linear_failed)"
                d="M202.793 80h-47.239a8.762 8.762 0 00-8.762 8.762v.012a8.762 8.762 0 008.762 8.763h47.239a8.762 8.762 0 008.762-8.763v-.012A8.762 8.762 0 00202.793 80z"
            />

            {/* Error Circle Background - Better positioned and sized */}
            <circle
                cx="300"
                cy="180"
                r="35"
                fill="#fff"
                stroke="var(--error-main)"
                strokeWidth="3"
                filter="url(#drop-shadow)"
            />

            {/* X Mark for Failed Order - Cleaner design */}
            <g fill="var(--error-main)" strokeWidth="3" stroke="var(--error-main)" strokeLinecap="round">
                <line x1="285" y1="165" x2="315" y2="195" />
                <line x1="315" y1="165" x2="285" y2="195" />
            </g>

            <defs>
                {/* Drop shadow filter for the error circle */}
                <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
                </filter>

                <linearGradient
                    id="paint0_linear_failed"
                    x1="267"
                    x2="80.541"
                    y1="272"
                    y2="247.455"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="var(--error-main)" />
                    <stop offset="1" stopColor="var(--error-dark)" />
                </linearGradient>

                <linearGradient
                    id="paint1_linear_failed"
                    x1="80"
                    x2="80"
                    y1="155.117"
                    y2="176.397"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="var(--error-light)" />
                    <stop offset="1" stopColor="var(--error-dark)" />
                </linearGradient>

                <linearGradient
                    id="paint2_linear_failed"
                    x1="146.792"
                    x2="146.792"
                    y1="80"
                    y2="97.537"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="var(--error-light)" />
                    <stop offset="1" stopColor="var(--error-dark)" />
                </linearGradient>
            </defs>
        </SvgIcon>
    );
});

export default memo(OrderFailedIllustration);