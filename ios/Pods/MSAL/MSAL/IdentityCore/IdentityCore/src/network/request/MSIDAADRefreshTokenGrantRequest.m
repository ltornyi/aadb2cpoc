// Copyright (c) Microsoft Corporation.
// All rights reserved.
//
// This code is licensed under the MIT License.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions :
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#import "MSIDAADRefreshTokenGrantRequest.h"
#import "MSIDAADRequestConfigurator.h"

@implementation MSIDAADRefreshTokenGrantRequest

- (instancetype)initWithEndpoint:(NSURL *)endpoint
                        clientId:(NSString *)clientId
                           scope:(NSString *)scope
                    refreshToken:(NSString *)refreshToken
                         context:(nullable id<MSIDRequestContext>)context
{
    self = [super initWithEndpoint:endpoint clientId:clientId scope:scope refreshToken:refreshToken context:context];
    if (self)
    {
        __auto_type requestConfigurator = [MSIDAADRequestConfigurator new];
        [requestConfigurator configure:self];
        
        NSMutableDictionary *parameters = [_parameters mutableCopy];
        parameters[MSID_OAUTH2_CLIENT_INFO] = @YES;
        _parameters = parameters;
    }
    
    return self;
}

@end
