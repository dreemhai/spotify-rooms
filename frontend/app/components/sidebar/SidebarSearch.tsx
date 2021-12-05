import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { debounce } from "lodash";
import { getTrackByString } from "../../lib/api/client";
import { useSpotify } from "../../context/spotify/SpotifyContext";
import { SearchItem } from "./SearchItem";

import { Input } from "../../css/input";
import { useData } from "../../context/websocket/WebsocketContext";
import { Server } from "../../types/server";
import { Close } from "../../icons/Close";

const SidebarSearchOverlay = styled.div<{ hasResults: boolean }>`
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${p => p.theme.body};
    opacity: ${p => (p.hasResults ? 0.85 : 0)};
    transition: opacity 0.3s;
    pointer-events: none;
`;

const SidebarSearchWrapper = styled.div`
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: ${p => p.theme.body};
`;

const SidebarInputWrapper = styled.div<{ hasResults: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    height: 10rem;
    padding: 0 2rem;
    border-top: ${p => p.hasResults && `0.1rem solid ${p.theme.borderColor}`};
    border-bottom: ${p => p.hasResults && `0.1rem solid ${p.theme.borderColor}`};
`;

const SearchResultList = styled.div<{ hasResults: boolean }>`
    padding: 0 2rem;
    max-height: ${p => (p.hasResults ? "50vh" : "0")};
    overflow-y: scroll;
    transition: max-height 0.3s;

    ::-webkit-scrollbar {
        display: none;
    }

    @media ${p => p.theme.bp.l} {
        padding: 0;
    }
`;

const SearchCloseButton = styled.button`
    position: absolute;
    z-index: 1;
    top: 50%;
    right: 2rem;
    transform: translateY(-50%);
`;

const SearchCloseIcon = styled(Close)`
    width: 2rem;
    height: 2rem;
`;

export const SidebarSearch: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { authToken, setAuthToken } = useSpotify();
    const { addTrackToRoom } = useData();
    const [search, setSearch] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Server.ResTrack[]>([]);

    useEffect(() => {
        searchByString(search);
    }, [search]);

    const searchByString = debounce(
        (str: string) => {
            if (!str) {
                setSearchResults([]);
                return;
            }

            getTrackByString(authToken, str, setAuthToken).then(setSearchResults);
        },
        100,
        { leading: true }
    );

    const addToPlaylist = (track: Server.ResTrack) => {
        if (!id) {
            return;
        }

        addTrackToRoom(track);
        setSearch("");
    };

    return (
        <>
            <SidebarSearchOverlay hasResults={searchResults.length > 0} />
            <SidebarSearchWrapper>
                <SidebarInputWrapper hasResults={searchResults.length > 0}>
                    <Input
                        type="text"
                        placeholder="Your favourite song..."
                        value={search}
                        onInput={e => setSearch((e.target as HTMLInputElement).value)}
                    />
                    {"" !== search && (
                        <SearchCloseButton onClick={() => setSearch("")}>
                            <SearchCloseIcon />
                        </SearchCloseButton>
                    )}
                </SidebarInputWrapper>
                <SearchResultList hasResults={searchResults.length > 0}>
                    {searchResults.map(track => (
                        <SearchItem key={track.id} onClick={() => addToPlaylist(track)} {...track} />
                    ))}
                </SearchResultList>
            </SidebarSearchWrapper>
        </>
    );
};
