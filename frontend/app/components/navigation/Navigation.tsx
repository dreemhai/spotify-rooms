import React from "react";
import styled from "styled-components";
import { Logo } from "../../icons/Logo";
import Link from "next/link";
import { ThemeSwitch } from "./ThemeSwitch";
import { Hamburger } from "./Hamburger";
import { useSpotify } from "../../context/spotify/SpotifyContext";

const NavigationWrapper = styled.div`
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    padding: 3rem 4rem;
`;

const NavigationInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const LogoWrapper = styled.button``;

const ThemeWrapper = styled.div`
    margin-right: 2rem;
`;

const ControlsWrapper = styled.div`
    display: flex;
    align-item: center;
`;

const LogoIcon = styled(Logo)`
    color: ${p => p.theme.logo};
    width: 12.5rem;
`;

export const Navigation: React.FC = () => {
    const { searchActive, toggleSearchActive } = useSpotify();

    return (
        <NavigationWrapper>
            <NavigationInner>
                <Link href="/dashboard">
                    <LogoWrapper>
                        <LogoIcon />
                    </LogoWrapper>
                </Link>
                <ControlsWrapper>
                    <ThemeWrapper>
                        <ThemeSwitch />
                    </ThemeWrapper>
                    {searchActive !== null && <Hamburger active={searchActive} onClick={toggleSearchActive} />}
                </ControlsWrapper>
            </NavigationInner>
        </NavigationWrapper>
    );
};
